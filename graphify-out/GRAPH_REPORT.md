# Graph Report - Cartefidelité  (2026-10-02)

## Corpus Check
- 665 files · ~4,786,067 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 3733 nodes · 11425 edges · 173 communities (153 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f98871c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scan/route.ts
- loyalty-labels.ts
- rbac.ts
- merchant-card-template-service.ts
- env.ts
- components/ui.tsx
- loyalty-program.ts
- ref_next_navigation
- getEmployeeSession
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-canvas.tsx
- requireMutatingRequest
- ads/[id]/confirm/route.ts
- loyalty-context.ts
- card-editor-properties.tsx
- cn
- ad-visual-workflow.ts
- clients/ui.tsx
- profile-page.tsx
- api-guard.ts
- google-wallet/route.ts
- google-auth.ts
- middleware.ts
- demo-visual.ts
- session.ts
- fiche.tsx
- SettingsPanel
- layout-shell.tsx
- create-super-admin.ts
- fife-life/merchant-detail.tsx
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- employee-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- scan-session.ts
- loyalty-commit.ts
- demo-routing.test.ts
- src/app/page.tsx
- compilerOptions
- WalletHome
- @prisma/client
- super-admin.test.ts
- qa-login.ts
- ref_node_path
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- ref_fs_promises
- react
- loyalty-service.test.ts
- scripts
- interactive-loyalty-card.tsx
- platform-stats.ts
- AdDetailPage
- qr-cache.ts
- vitest
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- types.ts
- staff-permissions.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- caisse-client-number.test.ts
- customer-qr-route.test.ts
- unsubscribe/route.ts
- theme-toggle.tsx
- campaigns/[id]/confirm/route.ts
- stripe.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- EmployeeDetailPanel
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- requireUser
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- customer-loyalty-overview.ts
- MerchantCampaignFiche
- lib/campaign-worker.ts
- loyalty-service.ts
- programme/ui.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- jsonError
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- layout-client.tsx
- ad-confirm-route.test.ts
- card-deck.tsx
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- cards-index.tsx
- merchant-cards-gallery.tsx
- sponsored-hours-pricing.ts
- webhook/route.ts
- merchants-list.tsx
- next
- push.ts
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- merchant-ad-edit.test.ts
- landing-page.test.ts
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- campaign-moderation-home.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- [kind]/route.ts
- ad-lifecycle-worker.ts
- events/route.ts
- customer-qr.ts
- qa-login/page.tsx
- marketing-balance.test.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- preview-data.ts
- marketing-topup-route.test.ts
- customer-preferences-route.test.ts
- sponsored-slot.tsx
- campaign-lifecycle.ts
- solde/ui.tsx
- landing-merchant-preview.tsx
- outils/ui.tsx
- customer-push-route.test.ts
- ad-detail.tsx
- ref_next_server
- EmployeeLoginScreen
- CreateMerchantWizard
- use-media-query.ts
- invitation/page.tsx
- sponsored-selection.ts
- landing-header.tsx
- media-storage-guard.ts
- campaign-audience.test.ts
- google-wallet-logo.test.ts
- landing-footer.tsx
- card-template-schema.ts

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 229 edges
2. `jsonOk()` - 203 edges
3. `requireMutatingRequest()` - 140 edges
4. `prisma` - 132 edges
5. `vitest` - 113 edges
6. `readJson()` - 105 edges
7. `react` - 103 edges
8. `clientIp()` - 100 edges
9. `userAgent()` - 96 edges
10. `@prisma/client` - 95 edges

## Surprising Connections (you probably didn't know these)
- `submit()` --indirect_call--> `schedule()`  [INFERRED]
  src/app/app/campagnes/ui.tsx → tests/ad-visual-journeys.test.ts
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveStripeMode()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isPaymentAllowedForMerchant()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (173 total, 20 thin omitted)

### Community 0 - "scan/route.ts"
Cohesion: 0.15
Nodes (18): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScanByClientNumber(), deriveClientNumber() (+10 more)

### Community 1 - "loyalty-labels.ts"
Cohesion: 0.12
Nodes (26): MerchantRewardProgressPanel(), TargetBlock(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), buildScanResult(), CustomerMerchantRewardProgress (+18 more)

### Community 2 - "rbac.ts"
Cohesion: 0.10
Nodes (26): CaissePage(), DashboardLayout(), heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS (+18 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (62): GET(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), normalizeCardTemplateForSlot(), defaultCardTemplateConfig(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES (+54 more)

### Community 4 - "env.ts"
Cohesion: 0.10
Nodes (13): GET(), dynamic, dynamic, isSafeAdUrl(), assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest() (+5 more)

### Community 5 - "components/ui.tsx"
Cohesion: 0.07
Nodes (26): ref_next_link, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), SPACES, ChangePasswordPage(), LOYALTY_MODES (+18 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.09
Nodes (39): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes(), LoyaltyAction (+31 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.26
Nodes (19): ref_next_navigation, CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), OutilsPage() (+11 more)

### Community 8 - "getEmployeeSession"
Cohesion: 0.23
Nodes (7): EmployeeLoginPage(), ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets, resolveLandingAuthTargets(), { getSessionUserMock, getEmployeeSessionMock }

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (34): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+26 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (44): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult(), CardLoyaltyWidgetConfig (+36 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (41): FILTER_MAP, GET(), DELETE(), deleteSchema, formatFifeLifeEntry(), HistoryCategory, deleteCampaignMedia(), createMerchantFullSchema (+33 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.11
Nodes (42): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+34 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.11
Nodes (65): POST(), POST(), POST(), POST(), POST(), POST(), schema, POST() (+57 more)

### Community 15 - "ads/[id]/confirm/route.ts"
Cohesion: 0.40
Nodes (9): computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, debitForCampaign(), elapsedHoursCount() (+1 more)

### Community 16 - "loyalty-context.ts"
Cohesion: 0.16
Nodes (20): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), ActiveMerchantLoyaltyContext, isMerchantOperational(), isProgramOperational() (+12 more)

### Community 17 - "card-editor-properties.tsx"
Cohesion: 0.12
Nodes (22): CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, qrOverlapsOthers(), BACKGROUND_FIT_LABELS, containsForbiddenTechnicalLabel(), DATA_KEY_LABELS (+14 more)

### Community 18 - "cn"
Cohesion: 0.08
Nodes (34): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), DEMO_CONFIG, HistoricalEntitlement (+26 more)

### Community 19 - "ad-visual-workflow.ts"
Cohesion: 0.18
Nodes (18): PATCH(), AdForWorkflow, approveSubmittedVersion(), createVersion(), Db, JourneyStage, LIVE_LIKE, merchantRespond() (+10 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.13
Nodes (17): CustomerDetailPage(), ClientsPage(), Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats (+9 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.06
Nodes (39): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, AvatarFileInput(), AvatarPreviewEditor() (+31 more)

### Community 22 - "api-guard.ts"
Cohesion: 0.21
Nodes (16): POST(), POST(), POST(), GET(), GET(), requireCaisse(), requireCaissePermission(), requireEmployee() (+8 more)

### Community 23 - "google-wallet/route.ts"
Cohesion: 0.07
Nodes (66): zod, POST(), POST(), dynamic, logCustomerQr(), POST(), runtime, schema (+58 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.08
Nodes (39): GET(), GET(), AppLoginPage(), CustomerLoginPage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage() (+31 more)

### Community 25 - "middleware.ts"
Cohesion: 0.13
Nodes (24): hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), legacyRedirectOrigin() (+16 more)

### Community 26 - "demo-visual.ts"
Cohesion: 0.15
Nodes (21): dynamic, MerchantProfilePage(), CarteIdentitePage(), AccountPage(), ParametresPage(), JoinMerchantPage(), getPublishedCardTemplate(), getProfileUser() (+13 more)

### Community 27 - "session.ts"
Cohesion: 0.13
Nodes (22): POST(), GET(), schema, DELETE(), GET(), parseUserAgent(), GET(), POST() (+14 more)

### Community 28 - "fiche.tsx"
Cohesion: 0.14
Nodes (16): AdStatus, Detail, euros(), HistoryRow, PaymentPreview, PayMethod, STATUS_LABELS, formatDateTime() (+8 more)

### Community 30 - "layout-shell.tsx"
Cohesion: 0.12
Nodes (14): recharts, ACTIVITY_LABELS, DashboardHome(), formatEuros(), Overview, QUICK_LINKS, SuperAdminStatsPage(), StatisticsPage() (+6 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "fife-life/merchant-detail.tsx"
Cohesion: 0.13
Nodes (15): AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+7 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (31): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+23 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.06
Nodes (38): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+30 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.11
Nodes (31): GET(), GET(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO (+23 more)

### Community 38 - "employee-session.ts"
Cohesion: 0.12
Nodes (28): ref_next_headers, GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), applyDemoRoleCookies() (+20 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.14
Nodes (17): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+9 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.12
Nodes (27): randomSuffix(), saveAdVisualFile(), appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), assertPublishedGoogleWalletMediaReadable(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind (+19 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "scan-session.ts"
Cohesion: 0.27
Nodes (16): formatCameraError(), QrScanner(), onDecode(), CAISSE_SCAN_PATH, CAMERA_START_TIMEOUT_MS, finalizeCameraStart(), formatRetryAfter(), INSTANT_DUPLICATE_MS (+8 more)

### Community 44 - "loyalty-commit.ts"
Cohesion: 0.07
Nodes (57): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+49 more)

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.12
Nodes (18): CaisseAliasPage(), EmployeeHomePage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE (+10 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (30): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+22 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "WalletHome"
Cohesion: 0.18
Nodes (20): useWalletEvents(), connect(), disconnect(), onVisibility(), WalletHome(), googleWalletEndpointForActiveCard(), canUseSessionStorage(), getStoredLastEventId() (+12 more)

### Community 49 - "@prisma/client"
Cohesion: 0.10
Nodes (38): @prisma/client, GET(), sortOrder(), GET(), loadProgram(), POST(), balanceFieldForUnit(), incrementBalanceData() (+30 more)

### Community 50 - "super-admin.test.ts"
Cohesion: 0.16
Nodes (17): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+9 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (28): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), configuredSubjectId(), createQaMagicLoginToken(), CreateQaMagicLoginTokenOptions (+20 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (37): ref_node_buffer, ref_node_fs, ref_node_fs_promises, ref_node_path, ref_node_url, ref_node_zlib, playwright, OUT (+29 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.19
Nodes (26): resolveClientNumber(), appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classProfileForMode(), classTemplateInfo(), globalClassPatchBody() (+18 more)

### Community 55 - "email.ts"
Cohesion: 0.22
Nodes (15): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+7 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.06
Nodes (68): GET(), GET(), PERIOD_KEYS, addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys() (+60 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.12
Nodes (9): resetSponsoredSessionState(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer, observers (+1 more)

### Community 59 - "ref_fs_promises"
Cohesion: 0.15
Nodes (11): ref_fs_promises, ref_sharp, OUT, tiers, files, INPUT_DIR, GET(), MIME (+3 more)

### Community 60 - "react"
Cohesion: 0.09
Nodes (29): ref_motion_react, react, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), DiscoverPage() (+21 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "interactive-loyalty-card.tsx"
Cohesion: 0.15
Nodes (16): InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, DEMO_TIER_DECK_ORDER, getLoyaltyCardBackground(), getLoyaltyCardTierLabel(), LOYALTY_CARD_BACKGROUNDS, LOYALTY_CARD_TIER_LABELS, LoyaltyCardTierKey (+8 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "AdDetailPage"
Cohesion: 0.22
Nodes (12): AdDetailPage(), confirmReason(), patch(), requestSend(), run(), sendProposal(), api(), formatCents() (+4 more)

### Community 66 - "qr-cache.ts"
Cohesion: 0.20
Nodes (14): MerchantInteractiveCard(), QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr(), getCachedQr(), inflight (+6 more)

### Community 67 - "vitest"
Cohesion: 0.10
Nodes (16): ref_fs, ref_path, vitest, ref_vitest_config, main(), outDir, shot(), outDir (+8 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "types.ts"
Cohesion: 0.10
Nodes (22): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, WalletEventPayload, isDocumentVisible(), UnlockRevealPhase (+14 more)

### Community 71 - "staff-permissions.ts"
Cohesion: 0.16
Nodes (11): EmployeeScanPage(), ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS, PERMISSION_LABELS (+3 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.12
Nodes (35): ref_react_dom_client, COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps (+27 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "caisse-client-number.test.ts"
Cohesion: 0.21
Nodes (10): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 75 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.17
Nodes (14): jose, bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, recordConsentEvents(), secretKey() (+6 more)

### Community 77 - "theme-toggle.tsx"
Cohesion: 0.40
Nodes (4): next-themes, MoonIcon(), SunIcon(), ThemeToggle()

### Community 78 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.17
Nodes (25): POST(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience(), CAMPAIGN_PRICE_CENTS (+17 more)

### Community 79 - "stripe.ts"
Cohesion: 0.12
Nodes (28): stripe, GET(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, constructStripeWebhookEvent(), createCampaignCheckoutSession() (+20 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.08
Nodes (28): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminAdDetailPage(), SuperAdminCampagnesPage() (+20 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.25
Nodes (11): main(), prisma, requiredEnv(), upsertEmployee(), processCaisseScan(), assertQrUsable(), QrError, QrPayload (+3 more)

### Community 85 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.16
Nodes (13): adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest(), merchantRespond() (+5 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "requireUser"
Cohesion: 0.11
Nodes (26): GET(), dynamic, GET(), dynamic, GET(), GET(), markReadSchema, PATCH() (+18 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.05
Nodes (26): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, audienceDisplay(), CampagnesPanel(), CampaignSummary (+18 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer-loyalty-overview.ts"
Cohesion: 0.09
Nodes (39): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, activityFromWalletEvent() (+31 more)

### Community 102 - "MerchantCampaignFiche"
Cohesion: 0.35
Nodes (10): api(), MerchantCampaignFiche(), addSources(), onFile(), onFramed(), post(), onFileChosen(), isExactBanner() (+2 more)

### Community 103 - "lib/campaign-worker.ts"
Cohesion: 0.25
Nodes (14): networkAudienceWhere(), backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick() (+6 more)

### Community 104 - "loyalty-service.ts"
Cohesion: 0.26
Nodes (13): assertEarnProgramRules(), updateWalletBalance(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), computeLoyalty(), LoyaltyError, LoyaltySnapshot (+5 more)

### Community 105 - "programme/ui.tsx"
Cohesion: 0.17
Nodes (13): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+5 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "jsonError"
Cohesion: 0.06
Nodes (71): GET(), PATCH(), GET(), POST(), GET(), GET(), DELETE(), dynamic (+63 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "notifications-center.tsx"
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "layout-client.tsx"
Cohesion: 0.21
Nodes (8): DashboardLayout(), AppNav(), icons, isActive(), TOOLS_PREFIXES, BellItem, formatWhen(), NotificationBell()

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "card-deck.tsx"
Cohesion: 0.11
Nodes (24): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+16 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.15
Nodes (14): POST(), schema, GET(), parsePlacement(), recordImpression(), click(), END, fake (+6 more)

### Community 125 - "cards-index.tsx"
Cohesion: 0.31
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 126 - "merchant-cards-gallery.tsx"
Cohesion: 0.29
Nodes (6): MerchantCardsPage(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass(), MerchantCardSlotSummary

### Community 127 - "sponsored-hours-pricing.ts"
Cohesion: 0.14
Nodes (22): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+14 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.22
Nodes (13): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), refundIncludedQuota() (+5 more)

### Community 129 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 130 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 131 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.15
Nodes (21): POST(), schema, POST(), DELETE(), GET(), mapEmployee(), PATCH(), employeeLoginUrl() (+13 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.24
Nodes (11): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert (+3 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.13
Nodes (26): ad(), approvedAd(), asAdmin(), asCustomer(), asMerchant(), ctx(), customerCard(), dataUrl() (+18 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.21
Nodes (9): adminStage(), createAd(), ctx(), fake, h, jsonReq(), merchantStage(), moderate() (+1 more)

### Community 143 - "[kind]/route.ts"
Cohesion: 0.28
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 144 - "ad-lifecycle-worker.ts"
Cohesion: 0.33
Nodes (8): log(), loop(), requestShutdown(), sleep(), computeAdLifecycleStatus(), runAdLifecycleTick(), isWithinUtcIntervals(), UtcInterval

### Community 145 - "events/route.ts"
Cohesion: 0.20
Nodes (13): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), shouldSendSseEvent() (+5 more)

### Community 146 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 147 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 148 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.18
Nodes (18): GET(), POST(), buildInvitationLink(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired() (+10 more)

### Community 151 - "preview-data.ts"
Cohesion: 0.13
Nodes (14): ref_react_dom_server, PREVIEW_BENEFITS, PREVIEW_CARDS, PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, PREVIEW_PROFILE_HISTORY, resetQrCache() (+6 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 153 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.26
Nodes (10): IMAGE_CLASS, SponsoredAd, SponsoredBanner(), SponsoredVariant, getDismissedAds(), rememberDismissed(), reportedThisSession, SponsoredPlacement (+2 more)

### Community 155 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 156 - "solde/ui.tsx"
Cohesion: 0.12
Nodes (17): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, CampaignWizard(), DEMO_BALANCE (+9 more)

### Community 157 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 158 - "outils/ui.tsx"
Cohesion: 0.29
Nodes (5): FidelisationPanel(), icons, OutilsPanel(), TOOLS, ToolCard()

### Community 159 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 160 - "ad-detail.tsx"
Cohesion: 0.11
Nodes (17): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+9 more)

### Community 161 - "ref_next_server"
Cohesion: 0.08
Nodes (14): ref_next_server, MerchantAppAccess, inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, adminMembership (+6 more)

### Community 162 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 163 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.14
Nodes (24): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+16 more)

### Community 167 - "landing-header.tsx"
Cohesion: 0.67
Nodes (3): isInternalRoute(), LandingHeader(), NAV_LINKS

### Community 168 - "media-storage-guard.ts"
Cohesion: 0.83
Nodes (3): deleteCardBackground(), deleteCardBackgroundIfUnused(), isCardBackgroundInUse()

### Community 172 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.10
Nodes (19): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+11 more)

## Knowledge Gaps
- **954 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+949 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1282 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `scan/route.ts`, `loyalty-labels.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `env.ts`, `employees/[id]/route.ts`, `components/ui.tsx`, `loyalty-program.ts`, `getEmployeeSession`, `campaign-test-mode-isolation.test.ts`, `google-wallet-doctor.ts`, `landing-page.test.ts`, `loyalty-widget.ts`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `card-editor-canvas.tsx`, `ad-lifecycle-worker.ts`, `[kind]/route.ts`, `loyalty-context.ts`, `push-client.ts`, `marketing-balance.test.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `preview-data.ts`, `google-auth.ts`, `customer-preferences-route.test.ts`, `middleware.ts`, `campaign-lifecycle.ts`, `marketing-topup-route.test.ts`, `profile-page.tsx`, `super-admin-campaign-moderation.test.ts`, `customer-push-route.test.ts`, `ref_next_server`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `merchant-ad-edit.test.ts`, `campaign-audience.test.ts`, `google-wallet-logo.test.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `demo-routing.test.ts`, `loyalty-commit.ts`, `scan-session.ts`, `loyalty-widget-view.tsx`, `@prisma/client`, `super-admin.test.ts`, `qa-login.ts`, `ref_node_path`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `react`, `loyalty-service.test.ts`, `platform-stats.ts`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `types.ts`, `merchant-card-renderer.tsx`, `caisse-client-number.test.ts`, `customer-qr-route.test.ts`, `unsubscribe/route.ts`, `campaigns/[id]/confirm/route.ts`, `stripe.ts`, `super-admin-session.ts`, `qr.ts`, `ad-visual-journeys.test.ts`, `customer-loyalty-overview.ts`, `loyalty-service.ts`, `campaign-worker.test.ts`, `jsonError`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `card-deck.tsx`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `loyalty-labels.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `loyalty-program.ts`, `loyalty-widget.ts`, `card-editor-canvas.tsx`, `requireMutatingRequest`, `loyalty-context.ts`, `events/route.ts`, `cn`, `ad-visual-workflow.ts`, `card-editor-properties.tsx`, `ad-lifecycle-worker.ts`, `api-guard.ts`, `preview-data.ts`, `customer-qr.ts`, `employee-invitation-service.ts`, `demo-visual.ts`, `campaign-lifecycle.ts`, `google-auth.ts`, `session.ts`, `create-super-admin.ts`, `fife-life/merchant-detail.tsx`, `card-editor.tsx`, `package.json`, `ref_next_server`, `employee-session.ts`, `sponsored-selection.ts`, `loyalty-commit.ts`, `super-admin.test.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `react`, `loyalty-service.test.ts`, `platform-stats.ts`, `types.ts`, `staff-permissions.ts`, `merchant-card-renderer.tsx`, `unsubscribe/route.ts`, `campaigns/[id]/confirm/route.ts`, `super-admin-session.ts`, `qr.ts`, `requireUser`, `customer-loyalty-overview.ts`, `lib/campaign-worker.ts`, `loyalty-service.ts`, `programme/ui.tsx`, `jsonError`, `cards-index.tsx`, `merchant-cards-gallery.tsx`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `merchants-list.tsx`, `loyalty-labels.ts`, `merchant-card-template-service.ts`, `components/ui.tsx`, `loyalty-widget-view.tsx`, `campaign-moderation-home.tsx`, `card-editor-canvas.tsx`, `loyalty-context.ts`, `card-editor-properties.tsx`, `cn`, `qa-login/page.tsx`, `clients/ui.tsx`, `profile-page.tsx`, `preview-data.ts`, `google-auth.ts`, `sponsored-slot.tsx`, `fiche.tsx`, `solde/ui.tsx`, `layout-shell.tsx`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `invitation/page.tsx`, `fife-life/merchant-detail.tsx`, `use-media-query.ts`, `scan/ui.tsx`, `scan-session.ts`, `loyalty-commit.ts`, `card-template-schema.ts`, `src/app/page.tsx`, `sponsored-slot.test.tsx`, `interactive-loyalty-card.tsx`, `qr-cache.ts`, `types.ts`, `merchant-card-renderer.tsx`, `theme-toggle.tsx`, `super-admin-session.ts`, `campagnes/ui.tsx`, `programme/ui.tsx`, `notifications-center.tsx`, `layout-client.tsx`, `card-deck.tsx`, `cards-index.tsx`, `merchant-cards-gallery.tsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _954 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `scan/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14666666666666667 - nodes in this community are weakly interconnected._
- **Should `loyalty-labels.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12012012012012012 - nodes in this community are weakly interconnected._
- **Should `rbac.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._