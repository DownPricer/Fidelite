# Graph Report - Cartefidelité  (2026-09-27)

## Corpus Check
- 608 files · ~4,745,306 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .example 4, .css 3)

## Summary
- 3319 nodes · 10136 edges · 171 communities (150 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 66 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `716aaf57`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- card-template-schema.ts
- insight-permissions.test.ts
- merchant-card-template-service.ts
- next
- react
- loyalty-commit.ts
- ref_next_navigation
- vitest
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-canvas.tsx
- jsonOk
- loyalty-service.ts
- super-admin/auth/login/route.ts
- wallet-home.tsx
- cn
- use-wallet-unlock-animation.ts
- jsonError
- profile-page.tsx
- insight-period.ts
- loyaltyBalanceForMode
- google-auth.ts
- env.ts
- card-editor-properties.tsx
- prisma.ts
- customer-reward-progress.ts
- reward-form-dialog.tsx
- middleware.ts
- create-super-admin.ts
- campaigns/[id]/confirm/route.ts
- CardEditorPage
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- deletion/confirm/route.ts
- employee-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- card-deck.tsx
- ref_fs_promises
- demo-mode.ts
- src/app/page.tsx
- compilerOptions
- card-editor-polish.test.ts
- loyalty-program-publication.ts
- customer-loyalty-overview.ts
- qa-login.ts
- ref_node_path
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- HourlySchedulePicker
- demo-visual.ts
- merchant-cards-gallery.tsx
- loyalty-service.test.ts
- scripts
- qr-cache.ts
- platform-stats.ts
- google-wallet-appearance.ts
- resolvePublishedMerchantCardTemplate
- @prisma/client
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- CardDeck
- [id]/merchant-detail.tsx
- merchant-card-renderer.tsx
- AdvantagesEditor
- verify-viewports.mjs
- ref_next_server
- unsubscribe/route.ts
- EmployeeDetailPanel
- MerchantDetailPage
- ads/[id]/confirm/route.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- wallet-hydration.test.tsx
- landing-header.tsx
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- card-template-validation.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- ref_path
- caisse-scan-route.test.ts
- generate-pwa-icons.mjs
- src/app/layout.tsx
- programme/ui.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- requireUser
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- google-wallet/route.ts
- insight-definitions.ts
- cards-index.tsx
- ad-confirm-route.test.ts
- ExpandableQrCode
- campaign-confirm-route.test.ts
- sponsored-hours-pricing.ts
- landing-page.test.ts
- campaign-quota.test.ts
- merchant-card-finish.test.ts
- webhook/route.ts
- lib/campaign-worker.ts
- discover-page.tsx
- preview-data.ts
- employees/[id]/route.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- merchant-card-slots.test.ts
- cardSlotForLoyaltyMode
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- getEmployeeSession
- CreateMerchantWizard
- loyalty-mode-cards.test.ts
- merchant-create-service.ts
- requireMerchantAdmin
- campaign-crud-routes.test.ts
- CampagnesPanel
- money.ts
- use-media-query.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- SettingsPanel
- marketing-topup-route.test.ts
- [kind]/route.ts
- globalObjectBody
- app/ui.tsx
- solde/ui.tsx
- getSessionUser
- landing-merchant-preview.tsx
- campaign-audience.test.ts
- scripts/campaign-worker.ts
- campaign-lifecycle.ts
- merchant-card-detail-mobile.test.tsx
- SettingsPage
- SponsorWizard
- SelfVisualCropper
- avatar-editor.tsx
- landing-hero-visual.tsx
- landing-faq.tsx
- insight-demo-data.ts
- landing-footer.tsx

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 193 edges
2. `jsonOk()` - 175 edges
3. `requireMutatingRequest()` - 118 edges
4. `prisma` - 110 edges
5. `vitest` - 99 edges
6. `react` - 96 edges
7. `@prisma/client` - 91 edges
8. `clientIp()` - 90 edges
9. `userAgent()` - 86 edges
10. `readJson()` - 84 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `configWithWidget()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/loyalty-widget.test.tsx → src/lib/card-template-schema.ts
- `mockLoyaltyContext()` --calls--> `progressTargetForBalance()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-context.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (171 total, 21 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.21
Nodes (11): CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber(), deriveClientNumber(), normalizeClientNumber(), normalizeCustomerNumber() (+3 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (27): LoyaltyWidgetProgress, baseStyle(), NextRewardView(), Props, shellStyle(), NextRewardStylePicker(), CardDecorativeStyle, cardElementSchema (+19 more)

### Community 2 - "insight-permissions.test.ts"
Cohesion: 0.40
Nodes (4): admin, cashier, grantedCashier, manager

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.19
Nodes (19): normalizeCardTemplateForSlot(), isLoyaltyProgramSlot(), loyaltyModeForCardSlot(), adaptTemplateConfigForCardSlot(), adaptTemplateConfigForGeneralSlot(), applySharedBackgroundToModeTemplates(), CreateMerchantCardSlotsInput, defaultTemplateConfigForSlot() (+11 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.06
Nodes (35): ref_next_link, react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), SPACES, EmployeeInvitationScreen() (+27 more)

### Community 6 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (50): appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName(), isMerchantActive(), isProgramActive(), loadEarnHistory() (+42 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.09
Nodes (48): ref_next_navigation, CaissePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage() (+40 more)

### Community 8 - "vitest"
Cohesion: 0.06
Nodes (25): vitest, decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval(), findUniqueSubscription, FREE_STATS, getFreeMerchantStats (+17 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.11
Nodes (20): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct(), ProgressCircle() (+12 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (46): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+38 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (42): FILTER_MAP, GET(), GET(), POST(), deleteSchema, formatFifeLifeEntry(), createMerchantFullSchema, merchantDeleteSchema (+34 more)

### Community 12 - "VisualPicker"
Cohesion: 0.29
Nodes (10): deleteCampaignMediaUrl(), readFileAsDataUrl(), uploadCampaignMedia(), VisualPicker(), onCropConfirm(), onFidetoFilesSelected(), onSelfFileSelected(), removeFidetoImage() (+2 more)

### Community 13 - "card-editor-canvas.tsx"
Cohesion: 0.11
Nodes (36): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+28 more)

### Community 14 - "jsonOk"
Cohesion: 0.17
Nodes (51): POST(), POST(), POST(), POST(), POST(), POST(), logScanBody(), POST() (+43 more)

### Community 15 - "loyalty-service.ts"
Cohesion: 0.14
Nodes (22): availableRewardModules(), buildGoogleWalletMerchantView(), loyaltyPointLabel(), merchantObjectBody(), textModule(), applyAdjustment(), applyEarnVisit(), applyRedeemReward() (+14 more)

### Community 16 - "super-admin/auth/login/route.ts"
Cohesion: 0.18
Nodes (15): dynamic, logCustomerQr(), POST(), runtime, schema, GET(), POST(), isCustomerQrInfrastructureError() (+7 more)

### Community 17 - "wallet-home.tsx"
Cohesion: 0.12
Nodes (19): ref_motion_react, react-dom, AddToGoogleWalletButton(), CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCodeProps (+11 more)

### Community 18 - "cn"
Cohesion: 0.07
Nodes (34): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+26 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.15
Nodes (23): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), sseChunk(), isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation() (+15 more)

### Community 20 - "jsonError"
Cohesion: 0.13
Nodes (27): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), GET() (+19 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.16
Nodes (20): GlassBottomSheet(), SheetAction(), HistoryFilter, ProfilePage(), patchProfile(), saveNameEdit(), APP_VERSION, APPEARANCE_OPTIONS (+12 more)

### Community 22 - "insight-period.ts"
Cohesion: 0.17
Nodes (26): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+18 more)

### Community 23 - "loyaltyBalanceForMode"
Cohesion: 0.29
Nodes (16): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, buildScanResult() (+8 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "env.ts"
Cohesion: 0.10
Nodes (12): dynamic, dynamic, assertEarnProgramRules(), assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie() (+4 more)

### Community 26 - "card-editor-properties.tsx"
Cohesion: 0.13
Nodes (19): REQUIRED_BY_SLOT, TEXT_TYPES, CARD_FONT_OPTIONS, CardFontId, BACKGROUND_FIT_LABELS, DATA_KEY_LABELS, dataKeyLabel(), FIT_MODE_LABELS (+11 more)

### Community 27 - "prisma.ts"
Cohesion: 0.10
Nodes (26): zod, POST(), GET(), schema, GET(), schema, dynamic, markReadSchema (+18 more)

### Community 28 - "customer-reward-progress.ts"
Cohesion: 0.17
Nodes (19): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), CustomerMerchantRewardProgress, MerchantRewardProgressTarget, REWARD_ALMOST_THRESHOLD_PERCENT, RewardProgressVisualState, progressLineForTarget() (+11 more)

### Community 29 - "reward-form-dialog.tsx"
Cohesion: 0.20
Nodes (12): emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit(), RewardTypeIcon(), rewardTypeLabel() (+4 more)

### Community 30 - "middleware.ts"
Cohesion: 0.28
Nodes (15): hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), legacyRedirectOrigin() (+7 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.16
Nodes (26): POST(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience(), networkAudienceWhere() (+18 more)

### Community 33 - "CardEditorPage"
Cohesion: 0.15
Nodes (20): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+12 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "deletion/confirm/route.ts"
Cohesion: 0.32
Nodes (6): AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar(), deletionConfirmSchema

### Community 38 - "employee-session.ts"
Cohesion: 0.10
Nodes (31): ref_next_headers, GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget() (+23 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.06
Nodes (63): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+55 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.14
Nodes (25): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+17 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "card-deck.tsx"
Cohesion: 0.10
Nodes (30): DeckItem, demoStartIndex(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps (+22 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.12
Nodes (13): ref_fs_promises, ref_sharp, OUT, shots, OUT, tiers, files, INPUT_DIR (+5 more)

### Community 45 - "demo-mode.ts"
Cohesion: 0.14
Nodes (17): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE (+9 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.12
Nodes (21): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+13 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "card-editor-polish.test.ts"
Cohesion: 0.17
Nodes (22): useWalletEvents(), connect(), disconnect(), onVisibility(), containsForbiddenTechnicalLabel(), ELEMENT_TYPE_LABELS, canUseSessionStorage(), getStoredLastEventId() (+14 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "customer-loyalty-overview.ts"
Cohesion: 0.08
Nodes (38): CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel() (+30 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (40): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), GET(), POST(), QaExchangeBody, qaJson() (+32 more)

### Community 52 - "ref_node_path"
Cohesion: 0.06
Nodes (21): ref_node_fs_promises, ref_node_path, playwright, OUT, OUT, shots, outDir, outDir (+13 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.15
Nodes (33): accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue(), ensureGlobalClassRecord() (+25 more)

### Community 55 - "email.ts"
Cohesion: 0.22
Nodes (15): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+7 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.11
Nodes (31): percentChange(), resolvePeriod(), buildFinancial(), buildOverview(), buildRewards(), buildSegments(), buildTeam(), fillSeries() (+23 more)

### Community 58 - "HourlySchedulePicker"
Cohesion: 0.17
Nodes (10): addDaysToDateInput(), formatHourRange(), HourlySchedulePicker(), addDay(), hourSelectOptions(), hoursToSlots(), scheduleDayError(), slotLabel() (+2 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.13
Nodes (22): CarteIdentitePage(), AccountPage(), ParametresPage(), PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, getProfileUser(), CLIENT_DEMO_COOKIE (+14 more)

### Community 60 - "merchant-cards-gallery.tsx"
Cohesion: 0.36
Nodes (5): MerchantCardsGallery(), slotStatusLabel(), slotTone(), statusBadgeClass(), MerchantCardSlotSummary

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "qr-cache.ts"
Cohesion: 0.20
Nodes (15): QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr(), getCachedQr(), getPersonalizedQr(), inflight (+7 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.23
Nodes (15): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+7 more)

### Community 65 - "google-wallet-appearance.ts"
Cohesion: 0.15
Nodes (13): contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS, GoogleWalletAppearance, googleWalletAppearanceSchema, googleWalletButtonLabelSchema, GoogleWalletConfigMap, googleWalletHexSchema, isReadableGoogleWalletColor() (+5 more)

### Community 66 - "resolvePublishedMerchantCardTemplate"
Cohesion: 0.22
Nodes (12): GET(), LOYALTY_MODES, GET(), logMerchantCardSwitch(), MerchantCardSwitchContext, MerchantCardSwitchStep, normalizeResolvedPublishedTemplate(), resolvePublishedMerchantCardTemplate() (+4 more)

### Community 67 - "@prisma/client"
Cohesion: 0.11
Nodes (33): @prisma/client, formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot(), buildProgramSnapshotFromContext() (+25 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "CardDeck"
Cohesion: 0.21
Nodes (10): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), readDeckMetrics(), CARD_NO_EXPAND_SELECTOR (+2 more)

### Community 71 - "[id]/merchant-detail.tsx"
Cohesion: 0.11
Nodes (19): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+11 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.09
Nodes (28): CardTemplateBackground(), LinearGauge(), MerchantCardPublicPreview(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode (+20 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 75 - "ref_next_server"
Cohesion: 0.10
Nodes (14): ref_next_server, assertSuperAdminProductionConfig(), isSuperAdminAllowedEmailsConfigured(), setSuperAdminEntryCookie(), SUPER_ADMIN_ENTRY_COOKIE, superAdminEntryCookieOptions(), basePrefs, consentEventCreateMany (+6 more)

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.15
Nodes (16): jose, bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, recordConsentEvents(), secretKey() (+8 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "ads/[id]/confirm/route.ts"
Cohesion: 0.11
Nodes (32): stripe, computeAdPricing(), POST(), GET(), priceSponsoredAd(), priceSponsoredHours(), CampaignCheckoutInput, checkoutExpiry() (+24 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.05
Nodes (42): recharts, SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), AdRequest (+34 more)

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
Cohesion: 0.19
Nodes (15): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+7 more)

### Community 85 - "wallet-hydration.test.tsx"
Cohesion: 0.13
Nodes (23): ref_node_fs, resolveDisplayQrSrc(), defaultCardTemplateConfig(), CUSTOMER_QR_DATA_KEY, isQrTemplateElement(), mergeMerchantCardUpdate(), parseCardTemplateFromPayload(), DEFAULT_QR_ELEMENT_ID (+15 more)

### Community 86 - "landing-header.tsx"
Cohesion: 0.33
Nodes (5): MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "card-template-validation.ts"
Cohesion: 0.22
Nodes (15): buildElementCatalog(), publishValidationResult(), elementTypeLabel(), validationMessage(), qrMinWidthValid(), inSafeZone(), PublishValidationResult, qrSilenceZone() (+7 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (18): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+10 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "ref_path"
Cohesion: 0.11
Nodes (14): ref_fs, ref_path, ref_vitest_config, main(), outDir, shot(), outDir, main() (+6 more)

### Community 102 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 103 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.13
Nodes (10): ref_next_font_google, next-themes, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister() (+2 more)

### Community 105 - "programme/ui.tsx"
Cohesion: 0.16
Nodes (14): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+6 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "requireUser"
Cohesion: 0.11
Nodes (26): GET(), DELETE(), GET(), dynamic, GET(), dynamic, GET(), GET() (+18 more)

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

### Community 118 - "google-wallet/route.ts"
Cohesion: 0.13
Nodes (26): POST(), POST(), POST(), schema, GET(), GET(), PERIOD_KEYS, ensureWalletClassRecord() (+18 more)

### Community 120 - "cards-index.tsx"
Cohesion: 0.29
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.13
Nodes (12): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+4 more)

### Community 122 - "ExpandableQrCode"
Cohesion: 0.40
Nodes (4): ref_react_dom_client, ExpandableQrCode(), handleActivate(), openQr()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-hours-pricing.ts"
Cohesion: 0.20
Nodes (9): slotAmountCents(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, rateForParisHour(), SPONSORED_HOUR_RATE_CENTS, SponsoredDayBreakdown, SponsoredDaySelection (+1 more)

### Community 125 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 126 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 127 - "merchant-card-finish.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.14
Nodes (19): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), refundIncludedQuota() (+11 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.35
Nodes (10): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+2 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "preview-data.ts"
Cohesion: 0.19
Nodes (11): PREVIEW_BENEFITS, PREVIEW_PROFILE_HISTORY, PREVIEW_QR, BenefitEntry, formatLoyaltyEntry(), HistoryCategory, HistoryEntry, mapLoyaltyCategory() (+3 more)

### Community 132 - "employees/[id]/route.ts"
Cohesion: 0.13
Nodes (25): POST(), schema, GET(), POST(), GET(), mapEmployee(), employeeLoginUrl(), GET() (+17 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 135 - "merchant-card-slots.test.ts"
Cohesion: 0.23
Nodes (11): CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, merchantCardsGalleryPath(), parseCardSlotSlug(), SLUG_TO_CARD_SLOT, merchantCardTemplateCreate (+3 more)

### Community 136 - "cardSlotForLoyaltyMode"
Cohesion: 0.24
Nodes (11): LegacyCardEditorRedirect(), cardSlotEditorPath(), cardSlotForLoyaltyMode(), displayStatusForSlot(), getEditableTemplateForSlot(), pickCanonicalTemplate(), pickCanonicalTemplateByMode(), resolveCurrentlyUsedSlot() (+3 more)

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "getEmployeeSession"
Cohesion: 0.15
Nodes (10): EmployeeLoginPage(), EmployeeLoginScreen(), onSubmit(), readApiJson(), ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets (+2 more)

### Community 141 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 142 - "loyalty-mode-cards.test.ts"
Cohesion: 0.20
Nodes (9): adaptTemplateConfigForLoyaltyMode(), ALL_LOYALTY_MODES, hasPublishedTemplateForMode(), merchantCardTemplateCount, merchantCardTemplateCreate, merchantCardTemplateFindFirst, merchantCardTemplateFindMany, merchantCardTemplateFindUnique (+1 more)

### Community 143 - "merchant-create-service.ts"
Cohesion: 0.31
Nodes (8): createAllModeTemplatesForMerchant(), createMerchantCardSlots(), createMerchantFull(), CreateMerchantInput, syncIsActiveFromStatus(), merchantFindUnique, transaction, userFindUnique

### Community 144 - "requireMerchantAdmin"
Cohesion: 0.12
Nodes (22): GET(), GET(), POST(), DELETE(), GET(), loadOwnedCampaign(), PATCH(), serializeCampaign() (+14 more)

### Community 145 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 146 - "CampagnesPanel"
Cohesion: 0.18
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 147 - "money.ts"
Cohesion: 0.14
Nodes (22): AmountField(), press(), KEYS, RewardConfig, evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable() (+14 more)

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.24
Nodes (15): buildInvitationLink(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), acceptInvitationWithPassword(), createMembershipInvitation() (+7 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 153 - "[kind]/route.ts"
Cohesion: 0.28
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 154 - "globalObjectBody"
Cohesion: 0.47
Nodes (9): appLinkData(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData(), localized(), merchantClassBody() (+1 more)

### Community 155 - "app/ui.tsx"
Cohesion: 0.25
Nodes (5): HomeStats, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 156 - "solde/ui.tsx"
Cohesion: 0.22
Nodes (13): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, formatCents() (+5 more)

### Community 157 - "getSessionUser"
Cohesion: 0.50
Nodes (5): dynamic, MerchantProfilePage(), JoinMerchantPage(), getPublishedCardTemplate(), getSessionUser()

### Community 158 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 160 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

### Community 161 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 162 - "merchant-card-detail-mobile.test.tsx"
Cohesion: 0.29
Nodes (4): ref_react_dom_server, PREVIEW_CARDS, resetQrCache(), orderedClasses

### Community 163 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 164 - "SponsorWizard"
Cohesion: 0.33
Nodes (3): estimateSponsorPricing(), SponsorWizard(), validateSponsoredSchedule()

### Community 166 - "avatar-editor.tsx"
Cohesion: 0.47
Nodes (5): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor()

### Community 167 - "landing-hero-visual.tsx"
Cohesion: 0.33
Nodes (5): CoffeeIcon(), QrCodeIcon(), WalletCardsIcon(), WifiIcon(), LandingHeroVisual()

### Community 168 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 170 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

## Knowledge Gaps
- **840 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+835 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1127 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `webhook/route.ts`, `insight-permissions.test.ts`, `card-template-schema.ts`, `employees/[id]/route.ts`, `react`, `loyalty-commit.ts`, `ref_next_navigation`, `merchant-card-slots.test.ts`, `campaign-test-mode-isolation.test.ts`, `loyalty-widget.ts`, `push-client.ts`, `getEmployeeSession`, `super-admin-campaign-moderation.test.ts`, `loyalty-mode-cards.test.ts`, `loyalty-service.ts`, `merchant-create-service.ts`, `campaign-crud-routes.test.ts`, `money.ts`, `use-wallet-unlock-animation.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `insight-period.ts`, `google-auth.ts`, `env.ts`, `[kind]/route.ts`, `marketing-topup-route.test.ts`, `customer-reward-progress.ts`, `middleware.ts`, `campaign-audience.test.ts`, `campaigns/[id]/confirm/route.ts`, `campaign-lifecycle.ts`, `package.json`, `google-wallet-media-crop.tsx`, `merchant-card-detail-mobile.test.tsx`, `statistiques-panel.tsx`, `employee-session.ts`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `card-editor-polish.test.ts`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `ref_node_path`, `email.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `platform-stats.ts`, `google-wallet-appearance.ts`, `resolvePublishedMerchantCardTemplate`, `@prisma/client`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `CardDeck`, `ref_next_server`, `unsubscribe/route.ts`, `ads/[id]/confirm/route.ts`, `qr.ts`, `wallet-hydration.test.tsx`, `ref_path`, `caisse-scan-route.test.ts`, `src/app/layout.tsx`, `campaign-worker.test.ts`, `ad-confirm-route.test.ts`, `ExpandableQrCode`, `campaign-confirm-route.test.ts`, `landing-page.test.ts`, `campaign-quota.test.ts`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `lib/campaign-worker.ts`, `preview-data.ts`, `employees/[id]/route.ts`, `react`, `loyalty-commit.ts`, `ref_next_navigation`, `vitest`, `merchant-card-slots.test.ts`, `loyalty-widget.ts`, `merchant-card-template-service.ts`, `card-editor-canvas.tsx`, `loyalty-service.ts`, `super-admin/auth/login/route.ts`, `requireMerchantAdmin`, `wallet-home.tsx`, `money.ts`, `jsonError`, `merchant-create-service.ts`, `employee-invitation-service.ts`, `use-wallet-unlock-animation.ts`, `google-auth.ts`, `env.ts`, `card-editor-properties.tsx`, `prisma.ts`, `customer-reward-progress.ts`, `getSessionUser`, `create-super-admin.ts`, `campaigns/[id]/confirm/route.ts`, `campaign-lifecycle.ts`, `package.json`, `CardEditorPage`, `employee-session.ts`, `scan/ui.tsx`, `loyalty-program-publication.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `merchant-cards-gallery.tsx`, `loyalty-service.test.ts`, `platform-stats.ts`, `resolvePublishedMerchantCardTemplate`, `merchant-card-renderer.tsx`, `unsubscribe/route.ts`, `super-admin-session.ts`, `qr.ts`, `wallet-hydration.test.tsx`, `card-template-validation.ts`, `programme/ui.tsx`, `requireUser`, `cards-index.tsx`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `discover-page.tsx`, `ref_next_navigation`, `merchant-card-slots.test.ts`, `loyalty-widget-view.tsx`, `card-editor-canvas.tsx`, `wallet-home.tsx`, `cn`, `use-wallet-unlock-animation.ts`, `use-media-query.ts`, `profile-page.tsx`, `card-editor-properties.tsx`, `app/ui.tsx`, `solde/ui.tsx`, `reward-form-dialog.tsx`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `merchant-card-detail-mobile.test.tsx`, `avatar-editor.tsx`, `scan/ui.tsx`, `landing-faq.tsx`, `card-deck.tsx`, `card-editor-polish.test.ts`, `customer-loyalty-overview.ts`, `qa-login.ts`, `merchant-cards-gallery.tsx`, `qr-cache.ts`, `@prisma/client`, `[id]/merchant-detail.tsx`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `wallet-hydration.test.tsx`, `landing-header.tsx`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `programme/ui.tsx`, `notifications-center.tsx`, `cards-index.tsx`, `ExpandableQrCode`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _840 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10606060606060606 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05917721518987342 - nodes in this community are weakly interconnected._
- **Should `loyalty-commit.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08246753246753247 - nodes in this community are weakly interconnected._