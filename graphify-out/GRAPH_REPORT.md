# Graph Report - Cartefidelité  (2026-10-05)

## Corpus Check
- 774 files · ~4,851,583 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 4250 nodes · 13528 edges · 190 communities (156 shown, 34 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7666f814`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan-route.test.ts
- loyalty-context.ts
- next
- merchant-card-template-service.ts
- env.ts
- react
- loyalty-program.ts
- merchant-billing.ts
- google-wallet/route.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- readJson
- VisualPicker
- card-editor-properties.tsx
- requireMerchantAdmin
- @prisma/client
- jsonError
- google-wallet.ts
- [id]/merchant-detail.tsx
- card-deck.tsx
- clients/ui.tsx
- session.ts
- merchant-card-finish.test.ts
- zod
- google-auth.ts
- hosts.ts
- requireMutatingRequest
- fife-life/merchant-detail.tsx
- ad-visual-parts.tsx
- merchant-app-access.ts
- sponsored-selection.ts
- employees/[id]/route.ts
- solde/ui.tsx
- card-editor.tsx
- package.json
- apply-ad-visual-crop.ts
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- stripe-webhook-marketing.test.ts
- media-storage.ts
- loyalty-commit.test.ts
- insight-period.ts
- loyalty-commit.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program-publication.ts
- preferences/route.ts
- qa-login.ts
- ref_node_path
- dependencies
- stripe.ts
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- diagnose-google-wallet-campaign-hero.ts
- sponsored-placements.test.ts
- merchant-plans.ts
- scripts
- facturation/ui.tsx
- platform-stats.ts
- demo-mode.ts
- card-enlarged-view.tsx
- vitest
- qr-cache.ts
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- campaign-en-cours.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- types.ts
- layout-client.tsx
- money.ts
- profile-page.tsx
- ads/[id]/confirm/route.ts
- card-template-schema.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- notifications-center.tsx
- campaign-moderation-home.tsx
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- client-number.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- [kind]/route.ts
- lib/campaign-worker.ts
- advantages-ui.tsx
- sponsored-test-broadcast.ts
- ad-detail-wallet-panel.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- caisse-scan.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- isGoogleWalletConfigured
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- use-wallet-unlock-animation.ts
- ad-confirm-route.test.ts
- jsonOk
- campaign-confirm-route.test.ts
- qr.ts
- MerchantDetailPage
- create-super-admin.ts
- HourlySchedulePicker
- demo-visual.ts
- scan/ui.tsx
- sponsored-hours-pricing.ts
- app/ui.tsx
- employee-invitation-service.ts
- super-admin-campaign-moderation.test.ts
- events/route.ts
- cn
- programme/ui.tsx
- landing-page.test.ts
- webhook/route.ts
- push-client.ts
- CardDeck
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- marketing-topup-route.test.ts
- qr/route.ts
- staff-notification-delivery.ts
- loyaltyBalanceForMode
- loyalty-service.test.ts
- qa-login/page.tsx
- campaigns/[id]/route.ts
- customer-preferences-route.test.ts
- wallet-home.tsx
- marketing-balance.test.ts
- super-admin-ad-moderation.test.ts
- sponsored-slot.tsx
- campaign-lifecycle.ts
- demo-routing.test.ts
- employee-session.ts
- CoverCropEditor
- customer-qr-route.test.ts
- ad-detail.tsx
- loyalty-reward-removal.ts
- caisse-scan.test.ts
- campaign-quota.test.ts
- merchant-ad-edit.test.ts
- customer-notifications-route.test.ts
- avatar-storage.ts
- statistics/route.ts
- merchant-signup-service.ts
- customer-push-route.test.ts
- EmployeeLoginScreen
- google-wallet-doctor.ts
- parametres/ui.tsx
- campaign-audience.test.ts
- demo/page.tsx
- carte/avantages/page.tsx
- super-admin/layout.tsx
- use-media-query.ts
- ref_fs_promises
- ref_motion_react
- ref_next_font_google
- ref_next_headers
- ref_next_link
- ref_next_navigation
- ref_next_server
- ref_node_fs_promises
- ref_react_dom_client
- ref_react_dom_server
- ref_vitest_config
- employe/layout.tsx

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 282 edges
2. `jsonOk()` - 245 edges
3. `requireMutatingRequest()` - 181 edges
4. `next` - 170 edges
5. `prisma` - 159 edges
6. `vitest` - 133 edges
7. `readJson()` - 130 edges
8. `clientIp()` - 129 edges
9. `react` - 121 edges
10. `userAgent()` - 116 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveStripeMode()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isPaymentAllowedForMerchant()`  [EXTRACTED]
  scripts/diagnose-ads.ts → src/lib/stripe-mode.ts
- `main()` --calls--> `isGoogleWalletConfigured()`  [EXTRACTED]
  scripts/diagnose-google-wallet-campaign-hero.ts → src/lib/env.ts
- `main()` --calls--> `globalObjectBody()`  [EXTRACTED]
  scripts/diagnose-google-wallet-campaign-hero.ts → src/lib/google-wallet.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (190 total, 34 thin omitted)

### Community 0 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 1 - "loyalty-context.ts"
Cohesion: 0.14
Nodes (20): formatAddress(), MerchantProfile(), join(), safeExternalUrl(), ActiveMerchantLoyaltyContext, getActiveMerchantLoyaltyContextBySlug(), isMerchantOperational(), isProgramOperational() (+12 more)

### Community 2 - "next"
Cohesion: 0.08
Nodes (36): nextConfig, next, CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage() (+28 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (65): runResetAction(), LegacyCardEditorRedirect(), CardEditorVariantRoute(), resolveDisplayQrSrc(), MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass() (+57 more)

### Community 4 - "env.ts"
Cohesion: 0.07
Nodes (24): web-push, GET(), GET(), dynamic, robots(), dynamic, sitemap(), isSafeAdUrl() (+16 more)

### Community 5 - "react"
Cohesion: 0.06
Nodes (43): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), recoverMessage(), metadata, ContactForm() (+35 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.09
Nodes (44): buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), progressTargetForBalance(), block(), buildNextBenefit(), centsToEarnAtLeast() (+36 more)

### Community 7 - "merchant-billing.ts"
Cohesion: 0.10
Nodes (28): GET(), GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult (+20 more)

### Community 8 - "google-wallet/route.ts"
Cohesion: 0.11
Nodes (34): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+26 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (32): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetView(), pct(), ProgressCircle() (+24 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (42): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, missingWidgetLabel(), publishValidationResult(), summarizeEditorValidation() (+34 more)

### Community 11 - "readJson"
Cohesion: 0.06
Nodes (63): POST(), POST(), POST(), POST(), logScanBody(), POST(), scanVia(), PATCH() (+55 more)

### Community 12 - "VisualPicker"
Cohesion: 0.31
Nodes (11): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onFidetoFilesSelected(), onSelfFileSelected() (+3 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (65): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+57 more)

### Community 14 - "requireMerchantAdmin"
Cohesion: 0.09
Nodes (44): EDITABLE_STATUSES, GET(), PATCH(), GET(), GET(), POST(), GET(), GET() (+36 more)

### Community 15 - "@prisma/client"
Cohesion: 0.12
Nodes (29): @prisma/client, buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget() (+21 more)

### Community 16 - "jsonError"
Cohesion: 0.09
Nodes (38): GET(), PATCH(), GET(), POST(), POST(), POST(), POST(), POST() (+30 more)

### Community 17 - "google-wallet.ts"
Cohesion: 0.10
Nodes (40): accessToken(), appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classProfileForMode(), classTemplateInfo(), customerQrValue() (+32 more)

### Community 18 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 19 - "card-deck.tsx"
Cohesion: 0.10
Nodes (28): DeckItem, demoStartIndex(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), LADDER (+20 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "session.ts"
Cohesion: 0.08
Nodes (40): GET(), POST(), POST(), schema, GET(), POST(), GET(), POST() (+32 more)

### Community 22 - "merchant-card-finish.test.ts"
Cohesion: 0.27
Nodes (12): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+4 more)

### Community 23 - "zod"
Cohesion: 0.08
Nodes (30): zod, POST(), schema, bodySchema, POST(), DELETE(), uploadSchema, GET() (+22 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.10
Nodes (30): GET(), GET(), AppLoginPage(), CustomerLoginPage(), CustomerSignupPage(), CustomerSignupForm(), isGoogleAuthConfigured(), consumeGoogleCallback() (+22 more)

### Community 25 - "hosts.ts"
Cohesion: 0.12
Nodes (29): isProduction(), appOriginForPublicLinks(), canonicalOrigin(), employeeOriginForPublicLinks(), FORBIDDEN_PUBLIC_HOSTS, hostMatches(), hostnameForbidden(), hostnameOf() (+21 more)

### Community 26 - "requireMutatingRequest"
Cohesion: 0.09
Nodes (66): POST(), POST(), schema, POST(), GET(), POST(), POST(), schema (+58 more)

### Community 27 - "fife-life/merchant-detail.tsx"
Cohesion: 0.09
Nodes (20): AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard() (+12 more)

### Community 28 - "ad-visual-parts.tsx"
Cohesion: 0.10
Nodes (26): AdStatus, api(), Detail, euros(), HistoryRow, MerchantCampaignFiche(), addSources(), onFile() (+18 more)

### Community 29 - "merchant-app-access.ts"
Cohesion: 0.11
Nodes (23): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+15 more)

### Community 30 - "sponsored-selection.ts"
Cohesion: 0.14
Nodes (23): main(), AdCandidate, CustomerZone, DeliveryCheck, diagnoseAdDelivery(), evaluateCampaignChecks(), GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS (+15 more)

### Community 31 - "employees/[id]/route.ts"
Cohesion: 0.39
Nodes (8): GET(), mapEmployee(), PATCH(), GET(), mapEmployee(), presetLabel(), statusLabel(), updateEmployeeSchema

### Community 32 - "solde/ui.tsx"
Cohesion: 0.11
Nodes (18): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), audienceDisplay(), BalanceData, CampaignWizard() (+10 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (31): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), saveDraft() (+23 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (25): description, engines, node, name, prisma, seed, private, version (+17 more)

### Community 35 - "apply-ad-visual-crop.ts"
Cohesion: 0.12
Nodes (27): sharp, CoverCropEditorSpec, GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), renderAdVisualCrop(), AD_BANNER_CROP_SPEC (+19 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.11
Nodes (29): GET(), fileUrlFromMediaPath(), isGoogleWalletHeroFilename(), isPublicGoogleWalletHeroMedia(), isPublicTestBroadcastWalletHeroMedia(), AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES (+21 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.08
Nodes (31): CarteLayout(), CompteLayout(), FinalisationPage(), FinalisationForm(), NotificationsLayout(), enforceCustomerWalletAccess(), beginCustomerOnboarding(), buildAccountRecoveryUrl() (+23 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.11
Nodes (30): GET(), MIME, GET(), MIME, appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground() (+22 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "insight-period.ts"
Cohesion: 0.21
Nodes (24): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+16 more)

### Community 44 - "loyalty-commit.ts"
Cohesion: 0.12
Nodes (28): assertEarnProgramRules(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction() (+20 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.16
Nodes (18): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+10 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.05
Nodes (50): next-themes, BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS (+42 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.19
Nodes (19): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+11 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "preferences/route.ts"
Cohesion: 0.24
Nodes (10): GET(), PATCH(), bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, extractConsentChanges() (+2 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.11
Nodes (30): assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken(), CreateQaMagicLoginTokenOptions (+22 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (39): ref_node_buffer, ref_node_fs, ref_node_path, ref_node_url, ref_node_zlib, playwright, outDir, pages (+31 more)

### Community 53 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+12 more)

### Community 54 - "stripe.ts"
Cohesion: 0.09
Nodes (35): stripe, checkoutExpiry(), createMerchantPlanCheckoutSession(), MerchantPlanCheckoutInput, BillingCustomerInput, billingParams(), CampaignCheckoutInput, checkoutExpiry() (+27 more)

### Community 55 - "email.ts"
Cohesion: 0.17
Nodes (26): nodemailer, ContactPage(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint() (+18 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (31): InsightRange, percentChange(), buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments(), buildTeam() (+23 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.11
Nodes (10): MobilePlacementPreview(), resetSponsoredSessionState(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer (+2 more)

### Community 59 - "diagnose-google-wallet-campaign-hero.ts"
Cohesion: 0.17
Nodes (21): main(), probePublicImage(), redactUrl(), approvedGoogleWalletHeroUrl(), explainWalletHeroResolution(), isDedicatedWalletHeroStorageUrl(), resolveApprovedWalletHeroForGoogle(), resolveCampaignModuleHeroPathOrUrl() (+13 more)

### Community 60 - "sponsored-placements.test.ts"
Cohesion: 0.15
Nodes (17): GET(), previewResponse(), withResolvedImage(), staffContext(), resolveSponsoredImageUrl(), loadAdPreviewCard(), parsePlacement(), selectSponsoredForCustomer() (+9 more)

### Community 61 - "merchant-plans.ts"
Cohesion: 0.13
Nodes (16): DemarrerPage(), metadata, MerchantSignupForm(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq() (+8 more)

### Community 62 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, diagnose:wallet-hero (+7 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.23
Nodes (15): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+7 more)

### Community 65 - "demo-mode.ts"
Cohesion: 0.19
Nodes (13): CaisseAliasPage(), EmployeeHomePage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE, src_lib_employee_demo_employee_demo_cookie (+5 more)

### Community 66 - "card-enlarged-view.tsx"
Cohesion: 0.12
Nodes (22): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCode(), handleActivate() (+14 more)

### Community 67 - "vitest"
Cohesion: 0.06
Nodes (25): ref_fs, ref_path, vitest, main(), outDir, shot(), outDir, main() (+17 more)

### Community 68 - "qr-cache.ts"
Cohesion: 0.16
Nodes (18): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr() (+10 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.12
Nodes (19): END, fake, h, previewCall(), START, END, fake, START (+11 more)

### Community 71 - "campaign-en-cours.ts"
Cohesion: 0.15
Nodes (13): CampagnesPanel(), statusTone(), AD_EN_COURS, AdEnCoursInput, ANNOUNCE_EN_COURS, CampaignEnCoursInput, isCampaignEnCours(), isSponsoredAdLiveNow() (+5 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.13
Nodes (29): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRendererProps, shouldHideElement(), shouldMaskProgress() (+21 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "types.ts"
Cohesion: 0.18
Nodes (9): LinearGauge(), MerchantCardPublicPreview(), MerchantCardRenderer(), MerchantFace(), MerchantProfileData, MerchantRoulette(), MerchantCardData, PublicMerchant (+1 more)

### Community 75 - "layout-client.tsx"
Cohesion: 0.21
Nodes (8): DashboardLayout(), AppNav(), icons, isActive(), TOOLS_PREFIXES, BellItem, formatWhen(), NotificationBell()

### Community 76 - "money.ts"
Cohesion: 0.14
Nodes (21): AmountField(), press(), KEYS, evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable(), RewardStatus (+13 more)

### Community 77 - "profile-page.tsx"
Cohesion: 0.05
Nodes (53): GET(), AccountPage(), ParametresPage(), src_app_globals, dynamic, manrope, metadata, viewport (+45 more)

### Community 78 - "ads/[id]/confirm/route.ts"
Cohesion: 0.14
Nodes (37): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+29 more)

### Community 79 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (20): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+12 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.05
Nodes (42): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), DiagnosticPage() (+34 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "notifications-center.tsx"
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 85 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.13
Nodes (16): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, fetchFile(), h (+8 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "client-number.ts"
Cohesion: 0.62
Nodes (5): deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber()

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (21): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+13 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 102 - "lib/campaign-worker.ts"
Cohesion: 0.08
Nodes (36): jose, backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick() (+28 more)

### Community 103 - "advantages-ui.tsx"
Cohesion: 0.15
Nodes (16): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+8 more)

### Community 104 - "sponsored-test-broadcast.ts"
Cohesion: 0.12
Nodes (27): DELETE(), GET(), publicGoogleWalletError(), SponsoredCard, adToSponsoredTestCard(), BroadcastAd, getSponsoredTestBroadcastAdId(), getSponsoredTestBroadcastAdminStatus() (+19 more)

### Community 105 - "ad-detail-wallet-panel.tsx"
Cohesion: 0.18
Nodes (15): onFileChosen(), AdDetailWalletPanel(), confirmCrop(), onFileChosen(), sendWalletProposal(), formatDateTime(), post(), Props (+7 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "caisse-scan.ts"
Cohesion: 0.25
Nodes (10): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber(), CAISSE_GRANT_TTL_MS, logWalletUnlock() (+2 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "isGoogleWalletConfigured"
Cohesion: 0.33
Nodes (10): GET(), isGoogleWalletConfigured(), markObjectError(), retryGoogleWalletObjectSync(), syncAllGoogleWalletGlobalObjects(), syncGoogleWalletGlobalObject(), syncGoogleWalletGlobalObjectsForCampaignVisibility(), syncGoogleWalletMembershipObject() (+2 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "use-wallet-unlock-animation.ts"
Cohesion: 0.20
Nodes (17): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), cardFromUnlockPayload(), fetchUnlockCardDetail(), isUnlockCardReadyForReveal(), parseTemplateFromPayload() (+9 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "jsonOk"
Cohesion: 0.05
Nodes (70): POST(), GET(), DELETE(), POST(), FILTER_MAP, GET(), dynamic, GET() (+62 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "qr.ts"
Cohesion: 0.26
Nodes (10): main(), prisma, requiredEnv(), upsertEmployee(), assertQrUsable(), QrError, QrPayload, secretKey() (+2 more)

### Community 125 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 126 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 127 - "HourlySchedulePicker"
Cohesion: 0.22
Nodes (14): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+6 more)

### Community 128 - "demo-visual.ts"
Cohesion: 0.18
Nodes (13): CarteIdentitePage(), PREVIEW_CARDS, PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, DEMO_EMAIL, DEMO_FIRST_NAME, DEMO_FULL_NAME (+5 more)

### Community 129 - "scan/ui.tsx"
Cohesion: 0.05
Nodes (67): GET(), ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeScanPage(), EmployeeProfile, EmployeeScanScreen(), Phase (+59 more)

### Community 130 - "sponsored-hours-pricing.ts"
Cohesion: 0.18
Nodes (11): slotAmountCents(), parisHourInstant(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, parisSlotEnd(), rateForParisHour(), SPONSORED_HOUR_RATE_CENTS (+3 more)

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employee-invitation-service.ts"
Cohesion: 0.17
Nodes (17): employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR (+9 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "events/route.ts"
Cohesion: 0.29
Nodes (9): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), shouldSendSseEvent() (+1 more)

### Community 135 - "cn"
Cohesion: 0.07
Nodes (34): DEMO, Employee, EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend() (+26 more)

### Community 136 - "programme/ui.tsx"
Cohesion: 0.15
Nodes (15): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+7 more)

### Community 137 - "landing-page.test.ts"
Cohesion: 0.17
Nodes (10): authTargets, connexionUi, faq, footer, header, heroVisual, mobileNav, page (+2 more)

### Community 138 - "webhook/route.ts"
Cohesion: 0.19
Nodes (18): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handleMerchantPlanCheckoutCompleted(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST() (+10 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "CardDeck"
Cohesion: 0.21
Nodes (10): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), readDeckMetrics(), CARD_NO_EXPAND_SELECTOR (+2 more)

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.21
Nodes (16): ad(), approvedAd(), asAdmin(), asCustomer(), asMerchant(), ctx(), customerCard(), dataUrl() (+8 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.23
Nodes (7): adminStage(), ctx(), fake, h, jsonReq(), moderate(), propose()

### Community 143 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 144 - "qr/route.ts"
Cohesion: 0.29
Nodes (12): dynamic, logCustomerQr(), POST(), runtime, schema, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+4 more)

### Community 145 - "staff-notification-delivery.ts"
Cohesion: 0.12
Nodes (25): log(), loop(), requestShutdown(), sleep(), AdWalletCtx, approveWalletVisualAsIs(), clearWalletVisual(), merchantRespondWalletVisual() (+17 more)

### Community 146 - "loyaltyBalanceForMode"
Cohesion: 0.11
Nodes (35): main(), dynamic, GET(), GET(), LOYALTY_MODES, GET(), dynamic, MerchantProfilePage() (+27 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 149 - "campaigns/[id]/route.ts"
Cohesion: 0.31
Nodes (8): DELETE(), GET(), loadOwnedCampaign(), PATCH(), POST(), schema, refundCampaignDebit(), campaignContentSchema

### Community 150 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 151 - "wallet-home.tsx"
Cohesion: 0.12
Nodes (25): DiscoverIconLink(), NotificationBellLink(), WalletHome(), ActiveWalletCard, activityFromWalletEvent(), ActivityItem, buildCardNextRewardEntry(), buildFifeLifeNextReward() (+17 more)

### Community 152 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 153 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.11
Nodes (23): DiscoverPage(), Merchant, src_components_fife_life_sponsored_banner_sponsoredad, SponsoredBanner(), isExternalUrl(), SponsoredAd, SponsoredOfferCard(), navigate() (+15 more)

### Community 155 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 157 - "employee-session.ts"
Cohesion: 0.17
Nodes (16): EmployeeLoginPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+8 more)

### Community 158 - "CoverCropEditor"
Cohesion: 0.33
Nodes (4): CoverCropEditor(), onHandlePointerDown(), move(), up()

### Community 159 - "customer-qr-route.test.ts"
Cohesion: 0.29
Nodes (5): generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug

### Community 160 - "ad-detail.tsx"
Cohesion: 0.08
Nodes (33): AdDetailPage(), confirmBannerCrop(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startTestBroadcast() (+25 more)

### Community 161 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 162 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 163 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 164 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 165 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 166 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 167 - "statistics/route.ts"
Cohesion: 0.15
Nodes (13): GET(), PERIOD_KEYS, requireMerchantStatsAccess(), InsightPeriodKey, getLockedInsightPlaceholder(), findUniqueSubscription, FREE_STATS, getFreeMerchantStats (+5 more)

### Community 168 - "merchant-signup-service.ts"
Cohesion: 0.14
Nodes (30): ref_crypto, CompteCommercantPage(), MerchantSignupAccountForm(), publicAppUrl(), MerchantPlanId, generateSignupCode(), hashSignupCode(), signupCodeExpiryDate() (+22 more)

### Community 169 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 170 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 171 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

## Knowledge Gaps
- **1051 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1046 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1408 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `demo-visual.ts`, `scan/ui.tsx`, `caisse-scan-route.test.ts`, `app/ui.tsx`, `env.ts`, `react`, `merchant-card-template-service.ts`, `cn`, `super-admin-ad-moderation.test.ts`, `super-admin-campaign-moderation.test.ts`, `marketing-topup-route.test.ts`, `loyaltyBalanceForMode`, `[id]/merchant-detail.tsx`, `clients/ui.tsx`, `session.ts`, `qa-login/page.tsx`, `zod`, `google-auth.ts`, `wallet-home.tsx`, `requireMutatingRequest`, `sponsored-slot.tsx`, `fife-life/merchant-detail.tsx`, `merchant-app-access.ts`, `employee-session.ts`, `hosts.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `customer-qr-route.test.ts`, `demo-routing.test.ts`, `ad-visuals.ts`, `customer-onboarding.ts`, `statistics/route.ts`, `merchant-signup-service.ts`, `media-storage.ts`, `customer-notifications-route.test.ts`, `customer-push-route.test.ts`, `merchant-ad-edit.test.ts`, `demo-session.ts`, `demo/page.tsx`, `carte/avantages/page.tsx`, `src/app/page.tsx`, `super-admin/layout.tsx`, `qa-login.ts`, `merchant-plans.ts`, `demo-mode.ts`, `employe/layout.tsx`, `vitest`, `types.ts`, `layout-client.tsx`, `profile-page.tsx`, `super-admin-session.ts`, `notifications-center.tsx`, `campaign-moderation-home.tsx`, `campagnes/ui.tsx`, `card-deck.tsx`, `lib/campaign-worker.ts`, `advantages-ui.tsx`, `customer-preferences-route.test.ts`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `jsonOk`, `campaign-confirm-route.test.ts`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `scan/ui.tsx`, `loyalty-context.ts`, `merchant-card-template-service.ts`, `employee-invitation-service.ts`, `next`, `events/route.ts`, `cn`, `programme/ui.tsx`, `loyalty-program.ts`, `loyalty-widget.ts`, `readJson`, `webhook/route.ts`, `card-editor-properties.tsx`, `requireMerchantAdmin`, `merchant-billing.ts`, `qr/route.ts`, `staff-notification-delivery.ts`, `loyaltyBalanceForMode`, `google-wallet.ts`, `loyalty-service.test.ts`, `session.ts`, `merchant-card-finish.test.ts`, `wallet-home.tsx`, `google-auth.ts`, `requireMutatingRequest`, `campaign-lifecycle.ts`, `ad-visual-parts.tsx`, `merchant-app-access.ts`, `employee-session.ts`, `sponsored-selection.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `loyalty-reward-removal.ts`, `customer-onboarding.ts`, `merchant-signup-service.ts`, `loyalty-commit.ts`, `loyalty-program-publication.ts`, `preferences/route.ts`, `qa-login.ts`, `insight-stats.ts`, `diagnose-google-wallet-campaign-hero.ts`, `platform-stats.ts`, `merchant-card-renderer.tsx`, `types.ts`, `money.ts`, `profile-page.tsx`, `ads/[id]/confirm/route.ts`, `card-template-schema.ts`, `super-admin-session.ts`, `lib/campaign-worker.ts`, `advantages-ui.tsx`, `sponsored-test-broadcast.ts`, `ad-detail-wallet-panel.tsx`, `use-wallet-unlock-animation.ts`, `jsonOk`, `qr.ts`, `create-super-admin.ts`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `caisse-scan-route.test.ts`, `loyalty-context.ts`, `next`, `merchant-card-template-service.ts`, `env.ts`, `react`, `loyalty-program.ts`, `merchant-billing.ts`, `google-wallet/route.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `@prisma/client`, `merchant-card-finish.test.ts`, `google-auth.ts`, `hosts.ts`, `requireMutatingRequest`, `fife-life/merchant-detail.tsx`, `merchant-app-access.ts`, `package.json`, `apply-ad-visual-crop.ts`, `statistiques-panel.tsx`, `ad-visuals.ts`, `customer-onboarding.ts`, `stripe-webhook-marketing.test.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `insight-period.ts`, `loyalty-commit.ts`, `src/app/page.tsx`, `loyalty-program-publication.ts`, `qa-login.ts`, `ref_node_path`, `stripe.ts`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `diagnose-google-wallet-campaign-hero.ts`, `sponsored-placements.test.ts`, `merchant-plans.ts`, `platform-stats.ts`, `card-enlarged-view.tsx`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `campaign-en-cours.ts`, `merchant-card-renderer.tsx`, `money.ts`, `profile-page.tsx`, `ads/[id]/confirm/route.ts`, `super-admin-session.ts`, `ad-visual-journeys.test.ts`, `client-number.ts`, `[kind]/route.ts`, `lib/campaign-worker.ts`, `sponsored-test-broadcast.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `use-wallet-unlock-animation.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `qr.ts`, `scan/ui.tsx`, `employee-invitation-service.ts`, `super-admin-campaign-moderation.test.ts`, `landing-page.test.ts`, `push-client.ts`, `CardDeck`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `marketing-topup-route.test.ts`, `staff-notification-delivery.ts`, `loyaltyBalanceForMode`, `loyalty-service.test.ts`, `customer-preferences-route.test.ts`, `wallet-home.tsx`, `marketing-balance.test.ts`, `super-admin-ad-moderation.test.ts`, `campaign-lifecycle.ts`, `demo-routing.test.ts`, `customer-qr-route.test.ts`, `loyalty-reward-removal.ts`, `caisse-scan.test.ts`, `campaign-quota.test.ts`, `merchant-ad-edit.test.ts`, `customer-notifications-route.test.ts`, `statistics/route.ts`, `merchant-signup-service.ts`, `customer-push-route.test.ts`, `campaign-audience.test.ts`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1051 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loyalty-context.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14153846153846153 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.08421052631578947 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05719298245614035 - nodes in this community are weakly interconnected._